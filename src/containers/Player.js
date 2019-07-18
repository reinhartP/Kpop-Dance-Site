import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import Plyr from 'plyr';
class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: ['ay97L0DAu9A', 'iRw4kL1CMI8'],
            player: '',
            options: { disableContextMenu: false },
            mirrored: true,
            ytIframe: '',
        };
        this.onReady = this.onReady.bind(this);
        this.toggleMirror = this.toggleMirror.bind(this);
    }
    componentDidMount() {
        let player = new Plyr(
            document.getElementById('player'),
            this.state.options
        );
        this.state.player = player;
        document.body.style.background = '#202124';
        player.on('ready', event => {
            this.onReady(event);
        });
        player.on('seeking', event => {});
        player.on('seeked', event => {});
        player.on('timeupdate', event => {});
        player.on('progress', event => {});
        player.on('playing', event => {});
        player.on('play', event => {});
        player.on('pause', event => {});
        player.on('volumechange', event => {});
        player.on('ratechange', event => {});
        player.on('ended', event => {});
        player.on('enterfullscreen', event => {});
        player.on('exitfullscreen', event => {});
        player.on('controlshidden', event => {});
        player.on('controlsshown', event => {});
        player.on('statechange', event => {});
    }
    toggleMirror() {
        let iframe = this.state.ytIframe;
        this.state.mirrored === true
            ? iframe.classList.remove('mirrored')
            : iframe.classList.add('mirrored');
        this.setState({
            mirrored: !this.state.mirrored,
        });
    }
    onReady(e) {
        let plyrEmbed = document.getElementsByClassName('plyr__video-embed')[0];
        this.setState({
            ytIframe: plyrEmbed.children[0],
        });
        this.state.ytIframe.classList.add('mirrored');
        this.state.ytIframe.classList.add('ytIframe-container');
        this.state.player.volume = 0.15;
        this.state.player.embed.setPlaybackQuality('tiny');
        this.state.player.play();
    }

    render() {
        return (
            <div>
                <Container>
                    <div className="plyr__video-embed" id="player">
                        <iframe
                            src={`https://www.youtube.com/embed/${
                                this.state.videoId[1]
                            }?origin=http://localhost:3000&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
                            allowFullScreen
                            allowtransparency="true"
                            allow="autoplay"
                        />
                    </div>
                    <Button onClick={this.toggleMirror}>Mirror Toggle</Button>
                </Container>
            </div>
        );
    }
}

export default Player;
