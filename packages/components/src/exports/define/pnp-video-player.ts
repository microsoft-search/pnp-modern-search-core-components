
import { VideoPlayerComponent } from "../../components/video-player/VideoPlayerComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.VideoPlayerComponent].toString(), VideoPlayerComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.VideoPlayerComponent]: VideoPlayerComponent;
  }
}