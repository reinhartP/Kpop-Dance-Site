import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Button } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import Plyr from 'plyr';
class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: '',
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
            title: '',
            volume: 0,
        };
        this.onReady = this.onReady.bind(this);
        this.toggleMirror = this.toggleMirror.bind(this);
    }
    componentDidMount() {
        document.body.style.background = '#202124';
        let id = this.props.id;
        let volume = Cookies.get('volume');
        if (id !== undefined) {
            this.setState(
                {
                    videoId: id,
                    volume: volume === undefined ? 0.2 : volume,
                },
                () => {
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
                        let currentTime = player.embed
                            .getCurrentTime()
                            .toFixed(2);

                        let loop = { ...this.state.loop };
                        if (loop.enabled) {
                            if (currentTime < loop.start) {
                                player.embed.seekTo(loop.start);
                            }
                            if (currentTime >= loop.end) {
                                player.embed.seekTo(loop.start);
                            }
                        }
                    });
                    player.on('progress', event => {});
                    player.on('playing', event => {});
                    player.on('play', event => {});
                    player.on('pause', event => {});
                    player.on('volumechange', event => {
                        Cookies.set('volume', this.state.player.volume);
                    });
                    player.on('ratechange', event => {});
                    player.on('ended', event => {});
                    player.on('enterfullscreen', event => {});
                    player.on('exitfullscreen', event => {});
                    player.on('controlshidden', event => {});
                    player.on('controlsshown', event => {});
                    player.on('statechange', event => {
                        switch (event.detail.code) {
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
                            default:
                                //unstarted
                                break;
                        }
                    });
                }
            );
        }
    }
    handleSpeed(input) {
        let player = this.state.player.embed;
        player.setPlaybackRate(input);
    }
    handleLoop(input) {
        if (input === 'start') {
            let start = this.state.player.embed.getCurrentTime().toFixed(2);
            let end = this.state.loop.end;
            this.setState({
                loop: {
                    enabled: start > end ? false : true,
                    start: start,
                    end: end,
                },
            });
        }
        if (input === 'end') {
            let start = this.state.loop.start;
            let end = this.state.player.embed.getCurrentTime().toFixed(2);
            this.setState({
                loop: {
                    enabled: end > start ? true : false,
                    start: start,
                    end: end,
                },
            });
        }
        if (input === 'clear') {
            this.setState({
                loop: {
                    enabled: false,
                    start: -1,
                    end: -1,
                },
            });
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
    onReady(e) {
        let player = this.state.player;
        let plyrEmbed = document.getElementsByClassName('plyr__video-embed')[0];
        this.setState({
            ytIframe: plyrEmbed.children[0],
            title: player.embed.getVideoData().title,
        });
        this.state.ytIframe.classList.add('mirrored');
        this.state.ytIframe.classList.add('ytIframe-container');
        player.volume = this.state.volume;
        player.play();
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>{this.state.title}</title>
                </Helmet>
                <Container>
                    <div className="plyr__video-embed" id="player">
                        <iframe
                            src={`https://www.youtube.com/embed/${
                                this.state.videoId
                            }?origin=http://localhost:3000&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1&amp`}
                            allowFullScreen
                            allowtransparency="true"
                            allow="autoplay"
                        />
                    </div>
                    <Button.Group size={'mini'} fluid={true}>
                        <Button
                            inverted
                            color={'grey'}
                            onClick={this.toggleMirror}
                            onMouseDown={e => e.preventDefault()}
                        >
                            Mirror Toggle
                        </Button>
                        <Button
                            inverted
                            color={'grey'}
                            onClick={() => this.handleLoop('start')}
                            onMouseDown={e => e.preventDefault()}
                        >
                            Loop Start
                        </Button>
                        <Button
                            inverted
                            color={'grey'}
                            onClick={() => this.handleLoop('end')}
                            onMouseDown={e => e.preventDefault()}
                        >
                            Loop End
                        </Button>
                        <Button
                            inverted
                            color={'red'}
                            onClick={() => this.handleLoop('clear')}
                            onMouseDown={e => e.preventDefault()}
                        >
                            Loop Clear
                        </Button>
                    </Button.Group>
                    <br />
                    <Button.Group
                        inverted
                        color={'grey'}
                        style={{ paddingTop: '5px' }}
                        size={'mini'}
                        fluid={true}
                    >
                        <Button
                            onClick={() => this.handleSpeed(0.25)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            0.25x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(0.5)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            0.5x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(0.75)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            0.75x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(1)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            1x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(1.25)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            1.25x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(1.5)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            1.5x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(1.75)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            1.75x
                        </Button>
                        <Button
                            onClick={() => this.handleSpeed(2)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            2x
                        </Button>
                    </Button.Group>
                </Container>
            </div>
        );
    }
}

export default Player;
