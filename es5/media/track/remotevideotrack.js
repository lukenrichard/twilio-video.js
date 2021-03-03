'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mixinRemoteMediaTrack = require('./remotemediatrack');
var VideoTrack = require('./videotrack');

var RemoteMediaVideoTrack = mixinRemoteMediaTrack(VideoTrack);

/**
 * A {@link RemoteVideoTrack} represents a {@link VideoTrack} published to a
 * {@link Room} by a {@link RemoteParticipant}.
 * @extends VideoTrack
 * @property {boolean} isEnabled - Whether the {@link RemoteVideoTrack} is enabled
 * @property {boolean} isSwitchedOff - Whether the {@link RemoteVideoTrack} is switched off
 * @property {Track.SID} sid - The {@link RemoteVideoTrack}'s SID
 * @property {?Track.Priority} priority - The subscribe priority of the {@link RemoteVideoTrack}
 * @emits RemoteVideoTrack#dimensionsChanged
 * @emits RemoteVideoTrack#disabled
 * @emits RemoteVideoTrack#enabled
 * @emits RemoteVideoTrack#started
 * @emits RemoteVideoTrack#switchedOff
 * @emits RemoteVideoTrack#switchedOn
 */

var RemoteVideoTrack = function (_RemoteMediaVideoTrac) {
  _inherits(RemoteVideoTrack, _RemoteMediaVideoTrac);

  /**
   * Construct a {@link RemoteVideoTrack}.
   * @param {Track.SID} sid - The {@link RemoteVideoTrack}'s SID
   * @param {MediaTrackReceiver} mediaTrackReceiver - A video MediaStreamTrack container
   * @param {boolean} isEnabled - whether the {@link RemoteVideoTrack} is enabled
   * @param {boolean} isSwitchedOff - Whether the {@link RemoteVideoTrack} is switched off
   * @param {function(?Track.Priority): void} setPriority - Set or clear the subscribe
   *  {@link Track.Priority} of the {@link RemoteVideoTrack}
   * @param {{log: Log}} options - The {@link RemoteTrack} options
   */
  function RemoteVideoTrack(sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, options) {
    _classCallCheck(this, RemoteVideoTrack);

    return _possibleConstructorReturn(this, (RemoteVideoTrack.__proto__ || Object.getPrototypeOf(RemoteVideoTrack)).call(this, sid, mediaTrackReceiver, isEnabled, isSwitchedOff, setPriority, options));
  }

  /**
   * Add a {@link VideoProcessor} to allow for custom processing of video frames belonging to a VideoTrack.
   * When a Participant unpublishes and re-publishes a VideoTrack, a new RemoteVideoTrack is created and
   * any VideoProcessors attached to the previous RemoteVideoTrack would have to be re-added again.
   * Only Chrome supports this as of now. Calling this API from a non-supported browser will result in a log warning.
   * @param {VideoProcessor} processor - The {@link VideoProcessor} to use.
   * @returns {this}
   * @example
   * class GrayScaleProcessor {
   *   constructor(percentage) {
   *     this.outputFrame = new OffscreenCanvas(0, 0);
   *     this.percentage = percentage;
   *   }
   *   processFrame(inputFrame) {
   *     this.outputFrame.width = inputFrame.width;
   *     this.outputFrame.height = inputFrame.height;
   *
   *     const context = this.outputFrame.getContext('2d');
   *     context.filter = `grayscale(${this.percentage}%)`;
   *     context.drawImage(inputFrame, 0, 0, inputFrame.width, inputFrame.height);
   *     return this.outputFrame;
   *   }
   * }
   *
   * const grayscaleProcessor = new GrayScaleProcessor(100);
   *
   * Array.from(room.participants.values()).forEach(participant => {
   *   const remoteVideoTrack = Array.from(participant.videoTracks.values())[0].track;
   *   remoteVideoTrack.addProcessor(grayscaleProcessor);
   * });
   */


  _createClass(RemoteVideoTrack, [{
    key: 'addProcessor',
    value: function addProcessor() {
      return _get(RemoteVideoTrack.prototype.__proto__ || Object.getPrototypeOf(RemoteVideoTrack.prototype), 'addProcessor', this).apply(this, arguments);
    }

    /**
     * Remove the previously added {@link VideoProcessor} using `addProcessor` API.
     * @param {VideoProcessor} processor - The {@link VideoProcessor} to remove.
     * @returns {this}
     * @example
     * class GrayScaleProcessor {
     *   constructor(percentage) {
     *     this.outputFrame = new OffscreenCanvas(0, 0);
     *     this.percentage = percentage;
     *   }
     *   processFrame(inputFrame) {
     *     this.outputFrame.width = inputFrame.width;
     *     this.outputFrame.height = inputFrame.height;
     *
     *     const context = this.outputFrame.getContext('2d');
     *     context.filter = `grayscale(${this.percentage}%)`;
     *     context.drawImage(inputFrame, 0, 0, inputFrame.width, inputFrame.height);
     *     return this.outputFrame;
     *   }
     * }
     *
     * const grayscaleProcessor = new GrayScaleProcessor(100);
     *
     * Array.from(room.participants.values()).forEach(participant => {
     *   const remoteVideoTrack = Array.from(participant.videoTracks.values())[0].track;
     *   remoteVideoTrack.addProcessor(grayscaleProcessor);
     * });
     *
     * document.getElementById('remove-button').onclick = () => {
     *   Array.from(room.participants.values()).forEach(participant => {
     *     const remoteVideoTrack = Array.from(participant.videoTracks.values())[0].track;
     *     remoteVideoTrack.removeProcessor(grayscaleProcessor);
     *   });
     * }
     */

  }, {
    key: 'removeProcessor',
    value: function removeProcessor() {
      return _get(RemoteVideoTrack.prototype.__proto__ || Object.getPrototypeOf(RemoteVideoTrack.prototype), 'removeProcessor', this).apply(this, arguments);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[RemoteVideoTrack #' + this._instanceId + ': ' + this.sid + ']';
    }

    /**
     * Update the subscribe {@link Track.Priority} of the {@link RemoteVideoTrack}.
     * @param {?Track.Priority} priority - the new subscribe {@link Track.Priority};
     *   If <code>null</code>, then the subscribe {@link Track.Priority} is cleared, which
     *   means the {@link Track.Priority} set by the publisher is now the effective priority.
     * @returns {this}
     * @throws {RangeError}
     */

  }, {
    key: 'setPriority',
    value: function setPriority(priority) {
      return _get(RemoteVideoTrack.prototype.__proto__ || Object.getPrototypeOf(RemoteVideoTrack.prototype), 'setPriority', this).call(this, priority);
    }
  }]);

  return RemoteVideoTrack;
}(RemoteMediaVideoTrack);

/**
 * The {@link RemoteVideoTrack}'s dimensions changed.
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} whose
 *   dimensions changed
 * @event RemoteVideoTrack#dimensionsChanged
 */

/**
 * The {@link RemoteVideoTrack} was disabled, i.e. "paused".
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} that was
 *   disabled
 * @event RemoteVideoTrack#disabled
 */

/**
 * The {@link RemoteVideoTrack} was enabled, i.e. "resumed".
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} that was
 *   enabled
 * @event RemoteVideoTrack#enabled
 */

/**
 * The {@link RemoteVideoTrack} started. This means there is enough video data
 * to begin playback.
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} that started
 * @event RemoteVideoTrack#started
 */

/**
 * A {@link RemoteVideoTrack} was switched off.
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} that was
 *   switched off
 * @event RemoteVideoTrack#switchedOff
 */

/**
 * A {@link RemoteVideoTrack} was switched on.
 * @param {RemoteVideoTrack} track - The {@link RemoteVideoTrack} that was
 *   switched on
 * @event RemoteVideoTrack#switchedOn
 */

module.exports = RemoteVideoTrack;