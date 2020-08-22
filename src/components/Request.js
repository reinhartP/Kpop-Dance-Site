import React, { Component } from 'react';
import { Accordion, Button, Form, Icon, Message } from 'semantic-ui-react';
import axios from 'axios';

import './Request.css';
class Request extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex:
                localStorage.getItem('activeIndex') === null
                    ? 0
                    : parseInt(localStorage.getItem('activeIndex')),
            title: '',
            artist: '',
            url: '',
            notes: '',
            success: false,
            error: false,
            titleError: false,
            artistError: false,
            urlError: false,
            msgHeader: '',
            msgContent: '',
            videoId: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        document.body.style.background = '#202124';
    }

    handleChange = (e, data) => {
        this.setState({
            error: false,
            [e.target.name]: data.value,
        });
        switch (e.target.name) {
            case 'title':
                this.setState({
                    titleError:
                        data.value === ''
                            ? {
                                  content: 'Please enter the song name',
                                  pointing: 'above',
                              }
                            : false,
                });
                break;
            case 'artist':
                this.setState({
                    artistError:
                        data.value === ''
                            ? {
                                  content: 'Please enter the artist',
                                  pointing: 'above',
                              }
                            : false,
                });
                break;
            case 'url':
                this.setState({
                    urlError:
                        data.value.length < 11
                            ? {
                                  content:
                                      'Please enter the YouTube url or YouTube video id',
                                  pointing: 'above',
                              }
                            : false,
                });
                break;
            default:
                break;
        }
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        localStorage.setItem('activeIndex', newIndex);
        this.setState({ activeIndex: newIndex });
    };

    handleSubmit = async () => {
        const { title, artist, url, notes } = this.state;
        await axios
            .post(
                'https://kpop-dance-backend.herokuapp.com//api/suggestions',
                {
                    title,
                    artist,
                    url,
                    notes,
                },
                { validateStatus: () => true }
            )
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        title: '',
                        artist: '',
                        url: '',
                        notes: '',
                        success: true,
                        error: false,
                        msgHeader: 'Success!',
                        msgContent: `Thanks for your request!`,
                        videoId: response.data.videoId,
                        responseStatus: response.status,
                    });
                } else if (response.status === 422) {
                    this.setState({
                        success: false,
                        error: true,
                        msgHeader: 'Invalid field',
                        msgContent: `There was an error with the ${response.data.error_field}`,
                        responseStatus: response.status,
                    });
                } else if (response.status === 409) {
                    this.setState({
                        success: false,
                        error: true,
                        msgHeader: 'Video was already requested',
                        msgContent: `It will be added soon :)`,
                        videoId: response.data.videoId,
                        responseStatus: response.status,
                    });
                } else if (response.status === 429) {
                    const now = new Date();

                    this.setState({
                        success: false,
                        error: true,
                        msgHeader: `You've made too many requests`,
                        msgContent: `Try again in ${Math.round(
                            (response.headers['x-ratelimit-reset'] -
                                Math.round(now.getTime() / 1000)) /
                                60
                        )} minutes.`,
                        videoId: response.data.videoId,
                        responseStatus: response.status,
                    });
                }
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    clearForm = () => {
        this.setState({
            error: false,
            success: false,
            title: '',
            artist: '',
            url: '',
            notes: '',
            titleError: false,
            artistError: false,
            urlError: false,
            msgHeader: '',
            msgContent: '',
            videoId: '',
        });
    };

    render() {
        const {
            activeIndex,
            title,
            artist,
            url,
            notes,
            titleError,
            artistError,
            urlError,
            error,
            success,
            msgHeader,
            msgContent,
            videoId,
            responseStatus,
        } = this.state;
        return (
            <Accordion fluid inverted styled style={{ background: '#202124' }}>
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}
                >
                    <Icon name="dropdown" color="grey" />
                    Request a dance practice video
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Form
                        onSubmit={this.handleSubmit}
                        error={error}
                        success={success}
                    >
                        <Form.Group style={{ justifyContent: 'center' }}>
                            <input type="submit" style={{ display: 'none' }} />
                            <Form.Input
                                label="Song"
                                placeholder="Song"
                                name="title"
                                value={title}
                                onChange={this.handleChange}
                                error={titleError}
                                width={3}
                                required
                            />
                            <Form.Input
                                label="Artist"
                                placeholder="Artist"
                                name="artist"
                                value={artist}
                                onChange={this.handleChange}
                                error={artistError}
                                width={3}
                                required
                            />
                            <Form.Input
                                label="Youtube URL"
                                placeholder="Youtube URL"
                                name="url"
                                value={url}
                                onChange={this.handleChange}
                                error={urlError}
                                width={3}
                                required
                            />
                            <Form.Input
                                label="Notes"
                                placeholder="Notes"
                                name="notes"
                                value={notes}
                                onChange={this.handleChange}
                                width={3}
                            />
                        </Form.Group>

                        <Button inverted color="green" type="submit">
                            Request
                        </Button>
                        <Button inverted color="red" onClick={this.clearForm}>
                            Clear
                        </Button>
                        <SubmitStatusMessage
                            error={error}
                            success={success}
                            header={msgHeader}
                            content={msgContent}
                            videoId={videoId}
                            responseStatus={responseStatus}
                        />
                    </Form>
                </Accordion.Content>
            </Accordion>
        );
    }
}

function SubmitStatusMessageContent(props) {
    let { videoId, content } = props;
    return (
        <div>
            <p>
                {content} In the meantime you can watch it{' '}
                <a
                    href={`/player/${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    here
                </a>
            </p>
        </div>
    );
}

function SubmitStatusMessage(props) {
    let { header, content, videoId, error, responseStatus } = props;
    console.log('videoid', videoId);
    if ([429, 422].includes(responseStatus))
        return (
            <Message
                error
                style={{
                    width: '20vw',
                    height: '90px',
                    margin: '10px auto 0 auto',
                }}
                header={header}
                content={content}
            />
        );
    return (
        <Message
            success={!error}
            error={error}
            style={{
                width: '20vw',
                height: '90px',
                margin: '10px auto 0 auto',
            }}
            header={header}
            content={
                <SubmitStatusMessageContent
                    videoId={videoId}
                    content={content}
                />
            }
        />
    );
}

export default Request;
