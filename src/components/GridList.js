import React, { Component } from 'react';
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
                            <div style={{ width: '210px' }}>
                                <a onClick={() => props.status(true, song.id)}>
                                    <img
                                        src={song.thumbnail}
                                        style={{
                                            width: '100%',
                                            cursor: 'pointer',
                                        }}
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
        } else {
            return (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto',
                        paddingTop: '20px',
                    }}
                >
                    {songs.map((song) => {
                        return (
                            <div
                                style={{
                                    gridRow: 'auto / span 1',
                                    width: '210px',
                                }}
                            >
                                <a onClick={() => props.status(true, song.id)}>
                                    <img
                                        src={song.thumbnail}
                                        style={{
                                            display: 'inline-block',
                                            width: '100%',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </a>

                                <a
                                    style={{
                                        display: 'flex',
                                        flex: '1',
                                        flexDirection: 'column',
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
                <Modal
                    size="large"
                    dimmer="blurring"
                    centered={false}
                    closeIcon
                    open={this.state.open}
                    onClose={this.close}
                >
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
