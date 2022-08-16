'use strict';
var CancelablePromise = require('./util/cancelablepromise');
/**
 * Create a {@link CancelablePromise<Room>}.
 * @param {function(function(Array<LocalTrack>): CancelablePromise<RoomSignaling>):
 *   Promise<function(): CancelablePromise<RoomSignaling>>} getLocalTracks
 * @param {function(Array<LocalTrack>): LocalParticipant} createLocalParticipant
 * @param {function(Array<LocalTrack>): CancelablePromise<RoomSignaling>} createRoomSignaling
 * @param {function(LocalParticipant, RoomSignaling): Room} createRoom
 * @returns CancelablePromise<Room>
 */
function createCancelableRoomPromise(getLocalTracks, createLocalParticipant, createRoomSignaling, createRoom) {
    var cancelableRoomSignalingPromise;
    var cancellationError = new Error('Canceled');
    return new CancelablePromise(function onCreate(resolve, reject, isCanceled) {
        var localParticipant;
        getLocalTracks(function getLocalTracksSucceeded(localTracks) {
            if (isCanceled()) {
                return CancelablePromise.reject(cancellationError);
            }
            console.log('banana are these tracks real?', localTracks);
            localParticipant = createLocalParticipant(localTracks);
            console.log('banana is this person real?', localParticipant);
            return createRoomSignaling(localParticipant).then(function createRoomSignalingSucceeded(getCancelableRoomSignalingPromise) {
                if (isCanceled()) {
                    throw cancellationError;
                }
                console.log('banana what is this promise', getCancelableRoomSignalingPromise());
                cancelableRoomSignalingPromise = getCancelableRoomSignalingPromise();
                console.log('banana cancelable roomsignaling', cancelableRoomSignalingPromise);
                return cancelableRoomSignalingPromise;
            });
        }).then(function roomSignalingConnected(roomSignaling) {
            if (isCanceled()) {
                roomSignaling.disconnect();
                throw cancellationError;
            }
            resolve(createRoom(localParticipant, roomSignaling));
        }).catch(function onError(error) {
            reject(error);
        });
    }, function onCancel() {
        if (cancelableRoomSignalingPromise) {
            cancelableRoomSignalingPromise.cancel();
        }
    });
}
module.exports = createCancelableRoomPromise;
//# sourceMappingURL=cancelableroompromise.js.map