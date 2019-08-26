import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import styles from './styles/Player.css';

class YoutubeBackground extends React.Component {

	constructor(props) {
		super(props)

		const aspectRatio = this.props.aspectRatio.split(':')

		this.state = {
			aspectRatio: aspectRatio[0] / aspectRatio[1],
			videoHeight: 10
		}

	}

	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions.bind(this))
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this))
	}

	updateDimensions() {
		const { aspectRatio } = this.state
		const containerWidth = this.container.clientWidth
		const containerHeight = this.container.clientHeight
		const containerAspectRatio = containerWidth / containerHeight

		let videoHeight = containerHeight
		let videoWidth = containerWidth
		let videoY = 0
		let videoX = 0

		if (containerAspectRatio > aspectRatio) {
			videoHeight = containerWidth / aspectRatio
			videoY = (videoHeight - containerHeight) / -2
		} else {
			videoWidth = containerHeight * aspectRatio
			videoX = (videoWidth - containerWidth) / -2
		}

		this.setState({
			videoHeight,
			videoWidth,
			videoY,
			videoX
		});
	}

	onEnd(event) {
		event.target.playVideo();
		this.props.onEnd(event)
	}

	onReady(event) {
		event.target.playVideo();
		this.props.onReady(event)
	}


	render() {
		const { videoHeight, videoWidth, videoX, videoY } = this.state
		const { style, children, className, overlay } = this.props
		const playerProps = (({ videoId, onReady, onEnd, onPlay, onPause, onError, onStateChange, onPlaybackRateChange, onPlaybackQualityChange }) => 
			({ videoId, onReady, onEnd, onPlay, onPause, onError, onStateChange, onPlaybackRateChange, onPlaybackQualityChange }))(this.props);

		const videoOptions = {
			playerVars: {
				autoplay: 1,
				controls: 0,
				rel: 0,
				showinfo: 0,
				mute: 1,
				modestbranding:1
			},
			host: this.props.nocookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com'
		};


		return (
			<div style={style} ref={c => this.container = c} className={[styles.container, className].join(' ')}>
				<div>{children}</div>
				<div
					className={styles.videoContainer}
					style={{
						width: videoWidth + 'px',
						height: videoHeight + 'px',
						top: videoY + 'px',
						left: videoX + 'px'
					}}
				>
					{overlay &&
						<div className={styles.overlay} style={{ backgroundColor: overlay }}></div>}
					<YouTube
						{...playerProps}
					
						opts={videoOptions}
						className={styles.videoIframe}
						containerClassName={styles.videoInnerContainer}
					></YouTube>
				</div>
			</div>

		);
	}
}

YoutubeBackground.propTypes = {
	videoId: PropTypes.string.isRequired,
	aspectRatio: PropTypes.string,
	overlay: PropTypes.string,
	className: PropTypes.string,
	onReady: PropTypes.func,
	onEnd: PropTypes.func,
};


YoutubeBackground.defaultProps = {
	aspectRatio: '16:9',
	overlay: 'false',
	onReady: () => { },
	onPlay: () => { },
	onPause: () => { },
	onError: () => { },
	onEnd: () => { },
}


export default YoutubeBackground;
