#!/bin/bash
# Ping script for PunjabiLingo - reminds user after 24 hours

echo "PunjabiLingo 24-hour reminder started..."
echo "You will receive a notification in 24 hours to check on your progress."

# Sleep for 24 hours (24 * 60 * 60 seconds)
sleep 86400

# Send notification using osascript (macOS)
osascript -e 'display notification "Time to check on your PunjabiLingo progress! Have you made your language learning goals today? 🌾" with title "PunjabiLingo Reminder" subtitle "Keep learning Punjabi!"'

# Also output to terminal
echo "PunjabiLingo reminder: Time to check your language learning progress! Keep learning Punjabi! 🌾"