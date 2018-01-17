happn-3 memory profiling
------------------------

The profiler starts up a server, and then runs a series of tests, each time doing a GC and heap dump on the server after the tests, the testing can be looped to repeat the tests and heap dumps.

The profiler stores the tests that will be run in ./__resources/client/tests - adding any mocha tests here will result in them being run as part of the process, you can use all the mocha goodness of .only and x etc. to only profile certain tests.

Instructions for use:

```

> npm install

#node run [client version] [server version] [repeat test and dump]

> node run 5.1.2 5.1.2 10

# which will run 5.1.2 happn clients via the tests against a 5.1.2 server, the same tests will be repeated 10 times, with each repeat doing a GC and heap dump into ./server/[version]/heap-dumps

```

Heap dumps:
-----------

Are stored in ./server/[version]/heap-dumps.

Read about comparing dumps in google chromes analyzer [here](https://developers.google.com/web/tools/chrome-devtools/memory-problems/heap-snapshots) NB: you dont need to record a snapshot just load the snapshots you wish to compare.