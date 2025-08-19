import fs from 'fs';
import path from 'path';
import { __dirname } from '../../index.js';

export const getUsers = async () => {
    try {
        const usersPath = path.join(__dirname, '/data/users.json');
        const usersData = await fs.promises.readFile(usersPath, 'utf-8');
        return JSON.parse(usersData).users;
    } catch (error) {
        console.error("Error reading users data:", error);
        throw error;
    }
}
