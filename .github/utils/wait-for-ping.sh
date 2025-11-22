#!/bin/bash

start_time=$(date +%s)

success=0

while true
do
	ping -c 4 $1 > /tmp/dummy.txt

	# Output looks something like
	# PING 10.60.45.3 (10.60.45.3) 56(84) bytes of data.
	# 64 bytes from 10.60.45.3: icmp_seq=2 ttl=64 time=1435 ms
	# 64 bytes from 10.60.45.3: icmp_seq=3 ttl=64 time=411 ms
	# 64 bytes from 10.60.45.3: icmp_seq=4 ttl=64 time=2.48 ms
	# 
	# --- 10.60.45.3 ping statistics ---
	# 4 packets transmitted, 3 received, 25% packet loss, time 3028ms
	# rtt min/avg/max/mdev = 2.475/616.235/1435.025/602.537 ms, pipe 2

	received_packets=$(cat /tmp/dummy.txt | tail -n 2 | head -n 1 | awk '{ print $4 }')

	if [ $((received_packets)) -gt 0 ];
	then
		echo "successful connection"
		success=1
		break
	fi

	current_time=$(date +%s)
	elapsed=$((current_time - start_time))

	if [ $elapsed -ge 120 ]; then
		echo "120 seconds elapsed, terminating check..."
		break
	fi
	
	echo "retrying in 1 second"
	sleep 1
done

if [ $success -eq 0 ]
then
	echo "could not connect to server" >&2
	exit 1
fi
