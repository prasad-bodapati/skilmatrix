#!/bin/bash
cd /home/runner/workspace/backend && mvn spring-boot:run -DskipTests &
BACKEND_PID=$!
sleep 5
cd /home/runner/workspace/frontend && exec npm run dev
