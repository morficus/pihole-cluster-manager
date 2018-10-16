#!/bin/bash

username=$1
host=$2
sshkey=$3

ssh -C -i $sshkey $username@$host "pihole updatePihole"
