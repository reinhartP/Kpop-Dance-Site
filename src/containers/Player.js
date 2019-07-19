import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import Plyr from 'plyr';
class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: ['ay97L0DAu9A', 'iRw4kL1CMI8'],
            currentVideo: 0,
            player: '',
            options: { disableContextMenu: false },
            mirrored: true,
            ytIframe: '',
            loop: {
                enabled: false,
                start: -1,
                end: -1,
            },
        };
        this.onReady = this.onReady.bind(this);
        this.toggleMirror = this.toggleMirror.bind(this);
        this.cycleVideo = this.cycleVideo.bind(this);
    }
    componentDidMount() {
        document.body.style.background = '#202124';
        let player = new Plyr(
            document.getElementById('player'),
            this.state.options
        );
        this.setState({
            player,
        });
        player.on('ready', event => {
            this.onReady(event);
        });
        player.on('seeking', event => {});
        player.on('seeked', event => {});
        player.on('timeupdate', event => {
            let player = this.state.player;
            let currentTime = player.embed.getCurrentTime().toFixed(2);

            let loop = {...this.state.loop};
            if(loop.enabled) {
                if(currentTime < loop.start) {
                    player.embed.seekTo(loop.start);
                }
                if(currentTime >= loop.end) {
                    player.embed.seekTo(loop.start);
                }
            }
        });
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
        player.on('statechange', event => {
            switch(event.detail.code) {
                case 0: //ended
                    this.state.player.restart();
                    break;
                case 1: //playing
                    break;
                case 2: //paused
                    break;
                case 3: //buffering
                    break;
                case 5: //video cued
                    break;
                default:    //unstarted
                    break;

            }
        });
    }
    handleSpeed(input) {
        let player = this.state.player.embed;
        player.setPlaybackRate(input);
    }
    handleLoop(input) {
        if(input === 'start') {
            let start = this.state.player.embed.getCurrentTime().toFixed(2);
            let end = this.state.loop.end;
            this.setState({
                loop: {
                    enabled: (start > end) ? false : true,
                    start: start,
                    end: end
                }
            })
        }
        if(input === 'end') {
            let start = this.state.loop.start;
            let end = this.state.player.embed.getCurrentTime().toFixed(2);
            this.setState({
                loop: {
                    enabled: (end > start) ? true : false,
                    start: start,
                    end: end,
                }
            })
        }
        if(input === 'clear') {
            this.setState({
                loop: {
                    enabled: false,
                    start: -1,
                    end: -1,
                }
            })
        }
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
    cycleVideo() {
        let player = this.state.player;
        player.pause();
        let currentVideo = this.state.currentVideo + 1;
        if (currentVideo >= this.state.videoId.length) {
            this.setState({
                currentVideo: 0,
            });
        }
        player.source = {
            type: 'video',
            sources: [
                {
                    src: this.state.videoId[currentVideo],
                    provider: 'youtube',
                },
            ],
        };
    }
    onReady(e) {
        let player = this.state.player;
        let plyrEmbed = document.getElementsByClassName('plyr__video-embed')[0];
        this.setState({
            ytIframe: plyrEmbed.children[0],
        });
        this.state.ytIframe.classList.add('mirrored');
        this.state.ytIframe.classList.add('ytIframe-container');
        player.volume = 0.15;
       
        player.play();
    }

    render() {
        let id = this.state.videoId[this.state.currentVideo];
        return (
            <div>
                <Container>
                    <div className="plyr__video-embed" id="player">
                        <iframe
                            src={`https://www.youtube.com/embed/${id}?origin=http://localhost:3000&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1&amp;vq=hd720`}
                            allowFullScreen
                            allowtransparency="true"
                            allow="autoplay"
                        />
                    </div>

                    <Button onClick={this.toggleMirror}>Mirror Toggle</Button>
                    <Button onClick={this.cycleVideo}>Cycle Video</Button>
                    <Button onClick={() => this.handleLoop('start')}>Loop Start</Button>
                    <Button onClick={() => this.handleLoop('end')}>Loop End</Button>
                    <Button onClick={() => this.handleLoop('clear')}>Loop Clear</Button>
                    <br></br>
                    <Button onClick={() => this.handleSpeed(0.25)}>0.25x</Button>
                    <Button onClick={() => this.handleSpeed(0.5)}>0.5x</Button>
                    <Button onClick={() => this.handleSpeed(0.75)}>0.75x</Button>
                    <Button onClick={() => this.handleSpeed(1)}>1x</Button>
                    <Button onClick={() => this.handleSpeed(1.25)}>1.25x</Button>
                    <Button onClick={() => this.handleSpeed(1.5)}>1.5x</Button>
                    <Button onClick={() => this.handleSpeed(1.75)}>1.75x</Button>
                    <Button onClick={() => this.handleSpeed(2)}>2x</Button>
                </Container>
            </div>
        );
    }
}

export default Player;
