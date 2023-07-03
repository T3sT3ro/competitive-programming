#!/bin/bash
# print below help if contains -h or --help

# Command acquired by: developer tools > network tab > request > copy > copy as cURL
# Cookies can be acquired by clicking lock icon on browser's address bar
# reads aoc-session.cookie
# Arguments [optional]:
#  [1st]     - year, default is this year
#  [rest...] - days (use bash substitution like {1..25} to generate range)
# BE AWARE THAT HISTORY CAN REMEMBER COOKIES, SO DON'T DO echo <cookie> > ...

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: $0 [year=<this year>] [day1=<today>] [day2] [day3] ..."
    echo "Fetches inputs from adventofcode.com. Requires session cookie."
    echo "Cookie can be included in the aoc-session.cookie file or passed to stdin."
    echo "Arguments:"
    echo "  year  - year of the event, default is this year, can be shorthand like 19"
    echo "  dayN  - day of the event, default is today, can be zero padded like 01"
    echo "Example: '$0 2019 {01..25}' or '$0 2023 05 06'"
    exit 0;
fi

COOKIEFILE=aoc-session.cookie
if [ -e $COOKIEFILE ]; then
    echo "using cookie file: $(tput setaf 3)$COOKIEFILE$(tput sgr0)" >&2
    SESSION_COOKIE=$(cat $COOKIEFILE)
else
    echo "reading from STDIN: $COOKIEFILE" >&2
    read -rep $'Paste the value of session cookie (just the hash):\n' SESSION_COOKIE
fi

if [[ -z $SESSION_COOKIE ]]; then
    echo "session cookie not specified" >&2
    exit 1;
fi;

YEAR=$(echo ${1:-`date +%Y`} | perl -pe 's/^(\d{2})$/20$1/')
shift
mkdir -p "$YEAR/IN"
DAYS=${@:-`date +%-d`} # today if not specified
# START=${2:-`date +%-d`}
# END=${3:-`if [[ -z "$2" ]]; then echo $START; else echo 25; fi`}

for i in $DAYS; do
    
    DAY_PADDED=$(printf "%02d" $i) # ensure zero-padded
    DAY_URL=$((10#$i)) # remove leading zeros
    
    echo -n "Fetching year $YEAR day $DAY_URL... ";
    curl "https://adventofcode.com/$YEAR/day/$DAY_URL/input" \
    -b "session=$SESSION_COOKIE" \
    -H 'authority: adventofcode.com' \
    -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
    -H 'accept-language: pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7' \
    -H 'cache-control: no-cache' \
    -H 'pragma: no-cache' \
    -H "referer: https://adventofcode.com/$YEAR/day/$DAY_URL" \
    -H 'sec-ch-ua: "Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "Linux"' \
    -H 'sec-fetch-dest: document' \
    -H 'sec-fetch-mode: navigate' \
    -H 'sec-fetch-site: same-origin' \
    -H 'sec-fetch-user: ?1' \
    -H 'upgrade-insecure-requests: 1' \
    -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' \
    --compressed -f -o "$YEAR/IN/$DAY_PADDED" \
    -w "status: %{http_code} size: %{size_download}B file: %{filename_effective} from: %{url} took: %{time_total}sec\n" \
    -sS 2>/dev/null\
    | perl -pe "s/(.*status: 200.*)/$(tput setaf 2)\$1$(tput sgr0)/" | perl -pe "s/(.*status: (?!200).*)/$(tput setaf 1)\$1$(tput sgr0)/"

    if [[ ${PIPESTATUS[0]} -ne 0 ]]; then continue; fi; # skip if curl failed
    SOLUTION="$YEAR/$DAY_PADDED.mjs"
    if [[ ! -f $SOLUTION ]]; then
        echo "programm missing, creating template..."
        cat > $SOLUTION <<TEMPLATE
import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
// --- browser devtools cutoff ---
const t = \$('IN/$DAY_PADDED').textContent.trim()
    .split('\n')
TEMPLATE
    fi
done
