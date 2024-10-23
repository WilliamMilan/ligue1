import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';
import './styles/app.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));
