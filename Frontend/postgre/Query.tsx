import React from "react";
import {gql} from '@apollo/client'

export const LOAD_USER = 
gql`
    query getAllUser{
        users{
        user_id
        username
        email
        password
        is_google
        }
    }
`