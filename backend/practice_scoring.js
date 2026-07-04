function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, '');
}

function levenshteinDistance(left, right) {
  const a = String(left || '');
  const b = String(right || '');

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + substitutionCost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function similarityScore(left, right) {
  const safeLeft = String(left || '');
  const safeRight = String(right || '');
  const maxLength = Math.max(safeLeft.length, safeRight.length);

  if (maxLength === 0) {
    return 100;
  }

  const distance = levenshteinDistance(safeLeft, safeRight);
  return Math.max(0, Math.round((1 - distance / maxLength) * 100));
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getSpeechFeedback(overallScore, transcriptScore, confidenceScore) {
  const feedback = [];

  if (!transcriptScore) {
    feedback.push('No transcript was captured. Try again with a clearer pronunciation.');
  } else if (transcriptScore < 60) {
    feedback.push('The spoken phrase differs from the target. Slow down and articulate each word.');
  } else if (transcriptScore < 85) {
    feedback.push('You are close. Focus on matching the full phrase more closely.');
  } else {
    feedback.push('Strong match. Your pronunciation is landing well.');
  }

  if (confidenceScore < 40) {
    feedback.push('Your microphone confidence was low. Try speaking a little louder and closer to the mic.');
  }

  if (overallScore >= 90) {
    feedback.push('Excellent speaking attempt.');
  } else if (overallScore >= 75) {
    feedback.push('Good attempt. One more clean repetition will lock it in.');
  } else {
    feedback.push('Keep practicing. The app will reward cleaner repeats with XP.');
  }

  return feedback;
}

function scoreSpeechAttempt({ expectedText, transcript, confidence = 0 }) {
  const expected = normalizeText(expectedText);
  const heard = normalizeText(transcript);
  const compactExpected = compactText(expected);
  const compactHeard = compactText(heard);

  const textSimilarity = similarityScore(heard, expected);
  const compactSimilarity = similarityScore(compactHeard, compactExpected);
  const confidenceScore = clampScore(Number(confidence) * 100);

  const overallScore = clampScore(textSimilarity * 0.6 + compactSimilarity * 0.25 + confidenceScore * 0.15);

  return {
    type: 'speech',
    overallScore,
    confidenceScore,
    transcriptScore: textSimilarity,
    compactTranscriptScore: compactSimilarity,
    expectedText: expectedText || '',
    transcript: transcript || '',
    feedback: getSpeechFeedback(overallScore, textSimilarity, confidenceScore),
  };
}

const TARGET_STROKES = {
  'ਅ': 1,
  'ਆ': 2,
  'ਇ': 1,
  'ਈ': 2,
  'ਉ': 1,
  'ਊ': 2,
  'ਏ': 1,
  'ਐ': 2,
  'ਓ': 1,
  'ਔ': 2,
  'ਕ': 2,
  'ਖ': 2,
  'ਗ': 2,
  'ਘ': 3,
  'ਙ': 2,
};

function flattenStrokes(strokes) {
  if (!Array.isArray(strokes)) {
    return [];
  }

  return strokes
    .map((stroke, strokeIndex) => (Array.isArray(stroke) ? stroke : [])
      .map((point, pointIndex) => ({
        x: Number(point?.x),
        y: Number(point?.y),
        t: Number(point?.t ?? pointIndex),
        strokeIndex,
      }))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)))
    .flat();
}

function getBounds(points) {
  if (points.length === 0) {
    return null;
  }

  return points.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxX: Math.max(bounds.maxX, point.x),
    maxY: Math.max(bounds.maxY, point.y),
  }), {
    minX: points[0].x,
    minY: points[0].y,
    maxX: points[0].x,
    maxY: points[0].y,
  });
}

function pathLength(points) {
  if (points.length < 2) {
    return 0;
  }

  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    length += Math.hypot(current.x - previous.x, current.y - previous.y);
  }

  return length;
}

function scoreBand(score, thresholds) {
  if (score >= thresholds.high) {
    return 100;
  }

  if (score >= thresholds.mid) {
    return Math.round(75 + ((score - thresholds.mid) / (thresholds.high - thresholds.mid || 1)) * 25);
  }

  if (score >= thresholds.low) {
    return Math.round(40 + ((score - thresholds.low) / (thresholds.mid - thresholds.low || 1)) * 35);
  }

  return Math.round((score / (thresholds.low || 1)) * 40);
}

function getHandwritingFeedback(scores, strokeCount, targetStrokeCount) {
  const feedback = [];

  if (scores.coverage < 50) {
    feedback.push('Fill more of the guide box so the letter is easier to read.');
  }

  if (scores.centering < 50) {
    feedback.push('Keep the character centered inside the writing area.');
  }

  if (strokeCount < targetStrokeCount) {
    feedback.push('Add the missing stroke or finishing mark.');
  } else if (strokeCount > targetStrokeCount + 1) {
    feedback.push('Try using fewer pen lifts for a smoother form.');
  }

  if (scores.smoothness < 50) {
    feedback.push('Move a little more steadily so the stroke shape stays clean.');
  }

  if (scores.overall >= 90) {
    feedback.push('Excellent handwriting match.');
  } else if (scores.overall >= 75) {
    feedback.push('Good form. One more clean trace will improve the score.');
  } else {
    feedback.push('Keep practicing the stroke shape and spacing.');
  }

  return feedback;
}

function scoreHandwritingAttempt({ expectedCharacter, strokes, canvasWidth = 320, canvasHeight = 220 }) {
  const points = flattenStrokes(strokes);
  const strokeCount = Array.isArray(strokes) ? strokes.filter((stroke) => Array.isArray(stroke) && stroke.length > 0).length : 0;
  const targetStrokeCount = TARGET_STROKES[expectedCharacter] || 2;

  if (points.length === 0) {
    return {
      type: 'handwriting',
      overall: 0,
      scores: {
        coverage: 0,
        centering: 0,
        strokeCount: 0,
        smoothness: 0,
      },
      feedback: ['Draw the character on the canvas before scoring it.'],
    };
  }

  const bounds = getBounds(points);
  const boxWidth = Math.max(1, bounds.maxX - bounds.minX);
  const boxHeight = Math.max(1, bounds.maxY - bounds.minY);
  const canvasArea = Math.max(1, canvasWidth * canvasHeight);
  const drawnArea = boxWidth * boxHeight;
  const coverageRatio = Math.max(0, Math.min(1, drawnArea / canvasArea));

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const centerOffset = Math.hypot(centerX - canvasWidth / 2, centerY - canvasHeight / 2);
  const maxCenterOffset = Math.hypot(canvasWidth / 2, canvasHeight / 2);
  const centeringRatio = 1 - Math.min(1, centerOffset / maxCenterOffset);

  const totalLength = pathLength(points);
  const diagonal = Math.hypot(boxWidth, boxHeight);
  const lengthRatio = diagonal === 0 ? 0 : totalLength / diagonal;

  const coverage = scoreBand(coverageRatio, { low: 0.02, mid: 0.08, high: 0.22 });
  const centering = scoreBand(centeringRatio, { low: 0.45, mid: 0.68, high: 0.86 });
  const strokeScore = scoreBand(1 / (1 + Math.abs(strokeCount - targetStrokeCount)), { low: 0.25, mid: 0.5, high: 0.75 });
  const smoothness = scoreBand(Math.min(1, lengthRatio / 3), { low: 0.2, mid: 0.45, high: 0.7 });

  const overall = clampScore(coverage * 0.3 + centering * 0.25 + strokeScore * 0.25 + smoothness * 0.2);

  return {
    type: 'handwriting',
    overall,
    expectedCharacter,
    strokeCount,
    targetStrokeCount,
    scores: {
      coverage,
      centering,
      strokeCount: strokeScore,
      smoothness,
    },
    bounds,
    feedback: getHandwritingFeedback(
      {
        overall,
        coverage,
        centering,
        smoothness,
      },
      strokeCount,
      targetStrokeCount,
    ),
  };
}

module.exports = {
  scoreSpeechAttempt,
  scoreHandwritingAttempt,
  normalizeText,
};