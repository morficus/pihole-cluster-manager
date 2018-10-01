# pihole-cluster-manager
cool things coming soon

## Installing Node on a Raspberry Pi
These instruction assume a few things:
* You already have [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) installed on your device.
* You are using an ARMv7 or ARMv8 chip (such as the Pi 2 or Pi 3)

Once the above pre-conditions are true, follow these steps:
1. While logged in to the Pi (either SSH or some other way), run this command to update the Debian apt package repository to include the NodeSource packages: `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
    * It's always good to know what a script is doing before running it. If you are heavy on the security side you can open `https://deb.nodesource.com/setup_10.x` in a browser and just read through it.
    * TL;DR: it does some checking to determine the Linux distribution you are running and tells the Debian package system to add the NodeSource package repository as a trusted source for obtaining Debian packages
    * This script will install the "Current" release of Node. If you rather install the "LTS" version... then change `setup_10.x` to `setup_8.x` in the above command
2. Install Node.js using good old apt: `sudo apt install -y nodejs`
3. Once the above is done, you can confirm things are installed by running `node -v`
    * If everything worked you should see some output like this: `v10.11.0`
