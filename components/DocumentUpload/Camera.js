import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Camera = forwardRef(({ className, autoPlay, width, height }, ref) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    const getUserMedia = (constraints) => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Modern browsers
            return navigator.mediaDevices.getUserMedia(constraints);
        } else {
            // Older browsers
            return new Promise((resolve, reject) => {
                const getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

                if (!getUserMedia) {
                    reject(new Error('getUserMedia is not supported in this browser'));
                } else {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                }
            });
        }
    };

    useEffect(() => {
        const startCamera = async() => {
            try {
                const mediaStream = await getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                setError(err.message);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getScreenshot = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const aspectRatio = video.videoWidth / video.videoHeight;
            const canvas = document.createElement('canvas');

            canvas.width = video.clientWidth;
            canvas.height = video.clientWidth / aspectRatio;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL('image/jpeg');
        }
        return null;
    };

    // Expose getScreenshot method to parent component using ref
    useImperativeHandle(ref, () => ({
        getScreenshot
    }));

    if (error) {
        return (
            <div style={{ width, height }} className={className}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ width, height }} className={className}>
            <video
                ref={videoRef}
                autoPlay={autoPlay}
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
});

Camera.displayName = 'Camera';

Camera.propTypes = {
    className: PropTypes.string,
    autoPlay: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Camera.defaultProps = {
    autoPlay: true,
    width: '100%',
    height: '100%'
};

export default Camera;
