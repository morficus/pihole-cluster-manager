#!/bin/bash

username=$1
host=$2
sshkey=$3
adlistfile=$4
remote_file_name="tmp-addlist.list"


rsync -e "ssh -i $sshkey" --rsync-path="sudo rsync" $adlistfile $username@$host:$remote_file_name
ssh -i $sshkey $username@$host "sudo mv $remote_file_name /etc/pihole/adlists.list"
ssh -i $sshkey $username@$host "pihole updateGravity"
