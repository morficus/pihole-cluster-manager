#!/bin/bash

username=$1
host=$2
sshkey=$3

# forcing an exist status of 0 because for some reason... even tho this command does run on the remote machine it
# still returns a non-0 exit status and prints nothing to stdout
ssh -C -i $sshkey $username@$host "pihole restartdns"
exit 0
