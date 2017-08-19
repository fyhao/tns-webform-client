# tns-webform-client

Simple Introduction on Branches
------
Dev: Both Telerik and tns use this branch to develop and share code. Dev run automated unit test

Integration: Dev to merge code to integration to trigger automated unit test & integration test on JavaScript code.

Staging: Dev to merge code to staging and should trigger automated build

StagingUITest: Staging to merge code to StagingUITest to run automated UI test.

Master: Subsequently Staging OR StagingUITest to merge code back to master


Reference:
https://www.objc.io/issues/6-build-tools/travis-ci/
http://stackoverflow.com/questions/16563364/how-can-i-add-private-key-to-the-distribution-certificate
https://gist.github.com/johanneswuerbach/5559514
https://medium.com/@atsakiridis/continuous-deployment-for-ios-using-travis-ci-55dcea342d9
https://gist.github.com/phatblat/0dd175b406cf2f3fbfc9


=======
Confirmed faced issue here:
https://www.bountysource.com/issues/41751175-manual-signing-with-distribution-provisioning-profile-fails-with-ns-2-5
