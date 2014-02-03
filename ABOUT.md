# Buckets

Buckets is a simple library for creating and using buckets.  You simply give your buckets keys and then assign them
callbacks which act as testers.  Each time you add a value, we loop through all your testers, passing in the value, and
add that value to any bucket that the value passes the test for.

