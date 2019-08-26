import React, { Component } from 'react';
import { Loader, Input, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import matchSorter from 'match-sorter';
import {
    Admin,
    Resource,
    Create,
    ListGuesser,
    EditGuesser,
    Edit,
    List,
    Datagrid,
    TextField,
    ArrayField,
    SingleFieldList,
    ChipField,
    SimpleForm,
    TextInput,
    SimpleFormIterator,
    ArrayInput,
} from 'react-admin';
import dataProvider from '../dataProvider';

class AdminPage extends Component {
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
    }
    async componentDidMount() {
        document.body.style.background = '#202124';
        let url = 'http://localhost:4500/api/artists';
        //let url = 'https://kpop-dance-backend.herokuapp.com/api/artists';
        this.setState({
            loading: false,
        });
    }

    render() {
        let provider = dataProvider('http://localhost:4500/api');
        return (
            <div>
                <Helmet>
                    <link
                        rel="preconnect"
                        href="https://kpop-dance-backend.herokuapp.com/api/artists"
                    />
                </Helmet>
                <Admin dataProvider={provider}>
                    <Resource
                        name="artists"
                        create={ArtistCreate}
                        list={ArtistList}
                        edit={SongEdit}
                    />
                    <Resource
                        name="songs"
                        list={ListGuesser}
                        edit={EditGuesser}
                    />
                </Admin>
            </div>
        );
    }
}

function ArtistCreate(props) {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="artist" />
                <ArrayInput source="songs">
                    <SimpleFormIterator>
                        <TextInput source="title" />
                        <TextInput source="youtubeId" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    );
}

function ArtistList(props) {
    return (
        <List
            {...props}
            title="Artists"
            sort={{ field: 'artist', order: 'ASC' }}
        >
            <Datagrid rowClick="edit">
                <TextField source="artist" />
                <TextField source="id" />
            </Datagrid>
        </List>
    );
}

function SongList(props) {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="artist" />
                <ArrayField source="songs">
                    <SingleFieldList>
                        <ChipField source="title" />
                    </SingleFieldList>
                </ArrayField>
            </Datagrid>
        </List>
    );
}

function SongEdit(props) {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="id" />
                <TextInput source="artist" />
                <ArrayInput source="songs">
                    <SimpleFormIterator>
                        <TextInput source="title" />
                        <TextInput source="youtubeId" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
}

export default AdminPage;
