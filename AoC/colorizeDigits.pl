#!/usr/bin/perl

use strict;
use warnings;

# Read the entire line from stdin
while (my $line = <STDIN>) {
    chomp($line);
    
    # Process each character in the line
    for my $char (split //, $line) {
        if ($char =~ /\d/) {
            # Map the digit to the corresponding character using tr
            my $mapped_char = $char =~ tr/0-9/mMrRyYgGcC/r;
            # Output the result for each digit
            print "{$mapped_char--$char--}";
        } else {
            # Output non-digit characters as they are
            print $char;
        }
    }
    
    # Output a newline at the end of each line
    print "\n";
}
