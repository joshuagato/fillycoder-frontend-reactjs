import React, { Component } from 'react';
import './Posts.scss';

import axios from 'axios';

class Posts extends Component {
    state = {
        posts: [],
        message: '',
        deleted: false,
        editing: false,
        postId: null
    }

    componentDidMount() {
        const graphqlQuery = {
            query: `
                query FetchPosts {
                    posts {
                        id username message createdAt updatedAt
                    }
                }
            `
        };
        axios.post('http://localhost:4004/graphql', graphqlQuery).then(response => {
            this.setState({ posts: response.data.data.posts });
        })
        .catch(error => console.log(error));
    }

    componentDidUpdate(_, prevState) {
        if(prevState.deleted !== this.state.deleted || prevState.posts.length !== this.state.posts.length || prevState.message !== this.state.message) {
            const graphqlQuery = {
                query: `
                    query FetchPosts {
                        posts {
                            id username message createdAt updatedAt
                        }
                    }
                `
            };
            axios.post('http://localhost:4004/graphql', graphqlQuery).then(response => {
                this.setState({ posts: response.data.data.posts, deleted: false });
            })
            .catch(error => console.log(error));
        }
    }
    
    // Creating a new Post
    postInputHandler = (event) => {
        this.setState({ message: event.target.value });
    };
    createPost = (event) => {
        event.preventDefault();

        const username = 'fillycoder22';
        const message = this.state.message;

        if(this.state.editing) {
            const graphqlQuery = {
                query: `
                    mutation EditPost($postId: Int, $username: String!, $message: String!) {
                        editPost(postInput: { postId: $postId, username: $username, message: $message })
                    }
                `,
                variables: { postId: +this.state.postId, username: username, message: message }
            };
    
            axios.post('http://localhost:4004/graphql', graphqlQuery).then(() => {
                this.setState({ message: '', editing: false });
            })
            .catch(error => console.log(error));
        }
        else {
            const graphqlQuery = {
                query: `
                    mutation CreateNewPost($username: String!, $message: String!) {
                        createPost(postInput: { username: $username, message: $message }) {
                            username message
                        }
                    }
                `,
                variables: { username: username, message: message }
            };
    
            axios.post('http://localhost:4004/graphql', graphqlQuery).then(() => {
                this.setState({ message: '' });
            })
            .catch(error => console.log(error));
        }
    };

    

    // Editing a post
    editPost = (postId) => {
        this.setState({ editing: true, postId: postId });

        const graphqlQuery = {
            query: `
                query FetchPost($id: Int!) {
                    post(postId: $id) {
                        id username message createdAt updatedAt
                    }
                }
            `,
            variables: { id: +postId }
        };
        axios.post('http://localhost:4004/graphql', graphqlQuery).then(response => {
            this.setState({ message: response.data.data.post.message });
        })
        .catch(error => console.log(error));
    }



    // Deleting a post
    deletePost = (postId) => {
        
        const graphqlQuery = {
            query: `
                mutation DeletePost($id: Int!) {
                    deletePost(postId: $id)
                }
            `,
            variables: { id: +postId }
        };

        axios.post('http://localhost:4004/graphql', graphqlQuery).then(() => {
            this.setState({ deleted: true })
            // this.setState(prevState => {
            //     return { deleted: true }
            // })
        })
        .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="posts">
                <form className="posts-form" onSubmit={this.createPost}>
                    <textarea onChange={this.postInputHandler} value={this.state.message}></textarea>
                    <button type="submit">CREATE POST</button>
                </form>
                <section className="loaded-posts">
                    <div>
                        {
                            this.state.posts.map(post => (
                                <article key={post.id}>
                                    <p><span>By {post.username}</span> <span>At {post.createdAt}</span></p>
                                    <p>{post.message}</p>
                                    <section>
                                        <button onClick={(id) => this.editPost(post.id)}>Edit</button>
                                        <button onClick={(id) => this.deletePost(post.id)}>Delete</button>
                                    </section>
                                </article>
                            ))
                        }
                    </div>
                </section>
            </div>
        );
    }
}

export default Posts;
