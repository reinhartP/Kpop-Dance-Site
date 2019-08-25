import React, { Component } from 'react';
import { Loader, Input, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import matchSorter from 'match-sorter';
function AdminPanel(props) {
    if (props.artists.length > 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    height: '100%',
                    alignItems: 'center',
                }}
            >
                {props.artists.map((artist, index) => {
                    return (
                        <div
                            style={{
                                lineHeight: '30px',
                                height: '30px',
                                width: '100%',
                                marginBottom: '5px',
                                border: '1px solid white',
                                textAlign: 'center',
                                alignItems: 'center',
                                color: 'white',
                            }}
                            onClick={() => props.status(true, artist.id)}
                        >
                            {artist.artist}
                        </div>
                    );
                })}
            </div>
        );
    }
    return <div />;
}

function EditPanel(props) {
    if (props.songs.length > 0) {
        return props.songs[props.currentArtist].songs.map((song, index) => {
            return (
                <div
                    style={{
                        lineHeight: '30px',
                        height: '30px',
                        marginBottom: '5px',
                        border: '1px solid white',
                        textAlign: 'center',
                        alignItems: 'center',
                        color: 'white',
                    }}
                >
                    {song.title}
                </div>
            );
        });
    }
    return <div />;
}
class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artists: {},
            songs: [],
            isLoading: true,
            searchString: '',
            currentArtist: '',
            filteredArtists: [],
            filteredSongs: [],
            open: false,
        };
        this.sortArtists = this.sortArtists.bind(this);
        this.receiveStatus = this.receiveStatus.bind(this);
        this.close = this.close.bind(this);
    }
    async componentDidMount() {
        document.body.style.background = '#202124';
        let url = 'http://localhost:4500/api/artists';
        //let url = 'https://kpop-dance-backend.herokuapp.com/api/artists';
        await axios.get(url).then(response => {
            if (response !== null) {
                this.setState({
                    isLoading: false,
                    artists: response.data,
                });
            }
        });
        this.sortArtists();
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(this.state.songs);
    }
    filterResults() {
        this.setState(currentState => {
            let songs = matchSorter(
                currentState.songs,
                currentState.searchString,
                {
                    keys: [
                        {
                            threshold: matchSorter.rankings.WORD_STARTS_WITH,
                            key: 'artist',
                        },
                        {
                            threshold: matchSorter.rankings.WORD_STARTS_WITH,
                            key: 'title',
                        },
                    ],
                }
            );
            return {
                filteredSongs: songs,
            };
        });
    }

    sortArtists(type = 'artist asc') {
        function compareArtist(a, b) {
            if (a.artist > b.artist) return 1;
            return -1;
        }
        if (this.state.artists.length > 0)
            switch (type) {
                case 'artist asc':
                    this.setState(currentState => {
                        currentState.artists.sort(compareArtist);
                        return {
                            artists: currentState.artists,
                        };
                    });
                    break;
            }
        console.log(this.state.artists);
    }
    handleChange = (event, data) => {
        this.setState({
            searchString: data.value,
        });
        this.filterResults();
    };
    async receiveStatus(open, id) {
        console.log(id);
        if (open === true) {
            let url = 'http://localhost:4500/api/artists/' + id;
            await axios.get(url).then(response => {
                if (response !== null) {
                    console.log(response.data);
                    this.setState(currentState => {
                        let artist = {
                            artistId: id,
                            songs: response.data,
                        };
                        currentState.songs.push(artist);
                        let currentArtist = currentState.songs.length - 1;
                        return {
                            songs: currentState.songs,
                            currentArtist,
                            open,
                        };
                    });
                }
            });
        }
    }
    close = () => {
        this.setState({
            open: false,
        });
    };
    render() {
        if (!this.state.isLoading) {
            return (
                <div
                    style={{
                        height: '100vh',
                        marginLeft: '15%',
                        marginRight: '15%',
                    }}
                >
                    <Helmet>
                        <link
                            rel="preconnect"
                            href="https://kpop-dance-backend.herokuapp.com/api/artists"
                        />
                    </Helmet>
                    <Modal
                        size="large"
                        dimmer="blurring"
                        style={{
                            height: '50%',
                            background: '#202124',
                        }}
                        centered={false}
                        closeIcon
                        open={this.state.open}
                        onClose={this.close}
                    >
                        <Modal.Description
                            style={{
                                lineHeight: '100%',
                            }}
                        >
                            <EditPanel
                                songs={this.state.songs}
                                currentArtist={this.state.currentArtist}
                            />
                        </Modal.Description>
                    </Modal>
                    <AdminPanel
                        artists={this.state.artists}
                        status={this.receiveStatus}
                    />
                </div>
            );
        }
        return (
            <div>
                <Loader active={this.state.isLoading} />
            </div>
        );
    }
}

export default Admin;
