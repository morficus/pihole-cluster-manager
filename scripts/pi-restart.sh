#!/bin/bash

username=$1
host=$2
sshkey=$3

# forcing an exist status of 0 because rebooting the device ends the session w/o any type of message, causing the
# script to exit with a non-0 status despite the reboot being a success
ssh -C -i $sshkey $username@$host "sudo shutdown --reboot now"
exit 0
