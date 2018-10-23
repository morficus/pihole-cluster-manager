#!/bin/bash

username=$1
host=$2
sshkey=$3

ssh -i $sshkey $username@$host "pihole version"
