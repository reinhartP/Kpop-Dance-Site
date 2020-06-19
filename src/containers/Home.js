import React, { Component } from 'react';
import { Loader, Input } from 'semantic-ui-react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import matchSorter from 'match-sorter';
import GridList from '../components/GridList';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artists: {},
            isLoading: true,
            searchString: '',
            filteredArtists: [],
        };
        this.sortSongs = this.sortSongs.bind(this);
        this.filterResults = this.filterResults.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    async componentDidMount() {
        document.body.style.background = '#202124';
        await axios
            .get('https://kpop-dance-backend.herokuapp.com/api/songs')
            .then((response) => {
                if (response !== null) {
                    let songs = [];
                    response.data.slice(0).map((artist) => {
                        artist.songs.map((artistSong) => {
                            songs.push({
                                artist: artist.artist,
                                title: artistSong.title,
                                thumbnail: artistSong.thumbnail,
                                id: artistSong.id,
                            });
                        });
                    });
                    console.log(songs);
                    this.setState({
                        isLoading: false,
                        artists: songs,
                    });
                }
            });
        this.sortSongs();
    }
    filterResults() {
        this.setState((currentState) => {
            let artists = matchSorter(
                currentState.artists,
                currentState.searchString,
                {
                    keys: [
                        {
                            threshold: matchSorter.rankings.WORD_STARTS_WITH,
                            key: 'artist',
                        },
                        {
                            threshold: matchSorter.rankings.CONTAINS,
                            key: 'title',
                        },
                    ],
                }
            );
            return {
                filteredArtists: artists,
            };
        });
    }

    sortSongs(type = 'artist asc') {
        function compareArtist(a, b) {
            if (a.artist > b.artist) return 1;
            return -1;
        }
        if (this.state.artists.length > 0)
            switch (type) {
                case 'artist asc':
                    this.setState((currentState) => {
                        currentState.artists.sort(compareArtist);
                        return {
                            artists: currentState.artists,
                        };
                    });
                    break;
            }
    }
    handleChange = (event, data) => {
        this.setState({
            searchString: data.value,
        });
        this.filterResults();
    };

    render() {
        if (!this.state.isLoading) {
            return (
                <div style={{ marginLeft: '15%', marginRight: '15%' }}>
                    <Helmet>
                        <link
                            rel="preconnect"
                            href="https://kpop-dance-backend.herokuapp.com/api/artists"
                        />
                    </Helmet>
                    <Input
                        onChange={this.handleChange}
                        placeholder="Filter..."
                        style={{ paddingTop: '20px' }}
                    />
                    <GridList
                        artists={
                            this.state.filteredArtists.length > 0
                                ? this.state.filteredArtists
                                : this.state.artists
                        }
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

export default Home;
