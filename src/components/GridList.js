import React, { Component } from 'react';
import { Modal, Grid, Container } from 'semantic-ui-react';
import './GridList.css';
function ArtistList(props) {
    if (props.artists.length > 0) {
        let songs = [];
        props.artists.forEach(artist => {
            artist.songs.forEach(song => {
                songs.push({
                    artist: artist.artist,
                    title: song.title,
                    thumbnail: song.thumbnail,
                    id: song.id,
                });
            });
        });
        return (
            <div className="grid">
                {songs.map(song => {
                    return (
                        <div style={{ width: '210px' }}>
                            <a onClick={() => props.status(true, song.id)}>
                                <img
                                    src={song.thumbnail}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                            </a>
                            <a
                                style={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9em',
                                }}
                                onClick={() => props.status(true, song.id)}
                            >
                                {song.title.length > 45
                                    ? song.title.slice(0, 45).concat('...')
                                    : song.title}
                            </a>
                        </div>
                    );
                })}
            </div>
        );
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
    close = () => this.setState({ open: false });
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
                <Modal
                    size="large"
                    dimmer="blurring"
                    centered={false}
                    closeIcon
                    open={this.state.open}
                    onClose={this.close}
                >
                    <Modal.Description>
                        <iframe
                            style={{
                                width: '100%',
                                height: '720px',
                            }}
                            title="Mirrored YouTube Video"
                            src={`player/${this.state.id}`}
                        />
                    </Modal.Description>
                </Modal>
                <ArtistList
                    artists={this.state.artists}
                    status={this.receiveStatus}
                />
            </div>
        );
    }
}

export default GridList;
