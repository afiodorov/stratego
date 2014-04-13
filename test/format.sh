#!/bin/bash
perl -0777 -pe 's/"position": \[\n\s+(\d+),\s+(\d+)\n\s+\]/"position": [$1,$2]/g' -
