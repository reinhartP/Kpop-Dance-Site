import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
    Admin,
    Resource,
    Create,
    Edit,
    List,
    Datagrid,
    TextField,
    SimpleForm,
    TextInput,
    SimpleFormIterator,
    ArrayInput,
} from 'react-admin';
import authProvider from '../authProvider';
import dataProvider from '../dataProvider';
import customRoutes from '../customRoutes';

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

        //let url = 'http://localhost:4500/api/artists';
        let url = 'https://kpop-dance-backend.herokuapp.com/api/artists';
        this.setState({
            loading: false,
        });
    }

    render() {
        let provider = dataProvider(
            'https://kpop-dance-backend.herokuapp.com/api'
        );
        return (
            <div>
                <Helmet>
                    <link
                        rel="preconnect"
                        href="https://kpop-dance-backend.herokuapp.com/api/artists"
                    />
                </Helmet>
                <Admin
                    customRoutes={customRoutes}
                    authProvider={authProvider}
                    dataProvider={provider}
                >
                    <Resource
                        name="artists"
                        create={ArtistCreate}
                        list={ArtistList}
                        edit={SongEdit}
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
