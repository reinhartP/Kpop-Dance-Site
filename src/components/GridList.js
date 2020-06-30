import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Modal } from 'semantic-ui-react';
import './GridList.css';
import Player from '../containers/Player.js';
function ArtistList(props) {
    if (props.artists.length > 0) {
        let songs = props.artists.slice(0);
        if (props.grid) {
            return (
                <div className="grid" style={{ paddingTop: '20px' }}>
                    {songs.map((song) => {
                        return (
                            <div style={{ width: '210px' }} key={song.id}>
                                <button
                                    className="link-button"
                                    style={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9em',
                                    }}
                                    onClick={() => props.status(true, song.id)}
                                >
                                    <img
                                        src={song.thumbnail}
                                        alt={`thumbnail for youtube video with title ${song.title}`}
                                        style={{
                                            width: '100%',
                                            cursor: 'pointer',
                                            paddingBottom: '4px',
                                        }}
                                    />
                                    {song.title.length > 45
                                        ? song.title.slice(0, 45).concat('...')
                                        : song.title}
                                </button>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }
    return <div />;
}
class GridList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artists: this.props.artists,
            open: false,
            id: '',
        };
        this.receiveStatus = this.receiveStatus.bind(this);
        this.close = this.close.bind(this);
    }
    receiveStatus(open, id) {
        this.setState({
            open,
            id,
        });
    }
    close = () => {
        this.setState({
            open: false,
        });
    };
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.artists !== this.props.artists) {
            this.setState({
                artists: this.props.artists,
            });
        }
    }
    render() {
        return (
            <div>
                <Helmet>
                    <title>Home</title>
                </Helmet>
                <Modal
                    size="large"
                    dimmer="blurring"
                    centered={false}
                    closeIcon
                    open={this.state.open}
                    onClose={this.close}
                >
                    <Modal.Content style={{ background: '#202124' }}>
                        <a href={`/player/${this.state.id}`}>fullscreen</a>
                    </Modal.Content>
                    <Modal.Description style={{ background: '#202124' }}>
                        <Player id={this.state.id} />
                    </Modal.Description>
                </Modal>
                <ArtistList
                    artists={this.state.artists}
                    status={this.receiveStatus}
                    grid={true}
                />
            </div>
        );
    }
}

export default GridList;
