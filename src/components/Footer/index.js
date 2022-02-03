/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import './footer.scss';
import DiscordIcon from '../../assets/images/icon-discord.png';
import ExplorerIcon from '../../assets/images/icon-explorer.png';
import GithubIcon from '../../assets/images/icon-github.png';
import TwitterIcon from '../../assets/images/icon-twitter.png';
import React from 'react';

const Footer = function () {
	const footerItems = [{
		icon: ExplorerIcon,
		link: 'https://testnet-explorer.nemtool.com',
		text: 'Explorer'
	}, {
		icon: DiscordIcon,
		link: 'https://discord.gg/fjkWXyf',
		text: 'Discord'
	}, {
		icon: GithubIcon,
		link: 'https://github.com/NemProject',
		text: 'Github'
	}, {
		icon: TwitterIcon,
		link: 'https://twitter.com/NEMofficial',
		text: 'Twitter'
	}];

	return (
		<div className="footer">
			{footerItems.map(item => (
				<div key={item.text}>
					<a target="_blank" href={item.link} rel="noreferrer">
						<img
							src={item.icon}
							alt={item.text}
							width={48}
							height={48}
						/>
						<div className="linkText">{item.text}</div>
					</a>
				</div>
			))}
		</div>
	);
};

export default Footer;
