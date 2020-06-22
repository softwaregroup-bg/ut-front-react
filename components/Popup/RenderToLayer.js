import PropTypes from 'prop-types';
import { Component } from 'react';
import {
    unstable_renderSubtreeIntoContainer as unstableRenderSubtreeIntoContainer,
    unmountComponentAtNode
} from 'react-dom';

export default class RenderToLayer extends Component {
    componentDidMount() {
        this.renderLayer();
    }

    componentDidUpdate() {
        this.renderLayer();
    }

    componentWillUnmount() {
        this.unrenderLayer();
    }

    unrenderLayer() {
        if (!this.layer) {
            return;
        }

        unmountComponentAtNode(this.layer);

        this.layer = null;
    }

    renderLayer() {
        const { open, render, containerId } = this.props;

        if (open) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                this.layer.id = containerId;
                document.body.appendChild(this.layer);
            }

            const layerElement = render();
            this.layerElement = unstableRenderSubtreeIntoContainer(this, layerElement, this.layer);
        } else {
            this.unrenderLayer();
        }
    }

    render() {
        return null;
    }
}

RenderToLayer.propTypes = {
    open: PropTypes.bool,
    containerId: PropTypes.string,
    render: PropTypes.func.isRequired
};

RenderToLayer.defaultProps = {
    containerId: 'controls'
};
