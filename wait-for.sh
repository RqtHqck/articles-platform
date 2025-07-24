#!/bin/sh
set -e

host="$1"
port="$2"
shift 2
cmd="$@"
timeout=30

echo "Waiting for $host:$port with timeout $timeout seconds..."

while ! nc -z -w 1 "$host" "$port" >/dev/null 2>&1
do
  timeout=$((timeout-1))
  if [ $timeout -le 0 ]; then
    echo "Timeout reached!"
    exit 1
  fi
  sleep 1
  echo "Waiting... ($timeout sec remaining)"
done

echo "$host:$port is available!"
exec $cmd