import PropTypes from 'prop-types';
import React from 'react';

export default class Text extends React.Component {
    static contextTypes = {
        language: PropTypes.string,
        translate: PropTypes.func
    }

    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        params: PropTypes.object,
        prefix: PropTypes.string, // prefix, narrowing search in translation dictionary
        interpolate: PropTypes.func
    }

    render() {
        let {children, params, prefix, interpolate = applyTemplate} = this.props;
        if (typeof children !== 'string') return children || null;
        let template = children;
        if (typeof this.context.translate === 'function') {
            const text = (prefix ? [prefix, children] : [children]).join('>');
            // Translate the template
            template = this.context.translate(text, this.context.language);
            if (template === text) {
                template = children;
            }
        }
        // In either case - apply the params to the template
        children = interpolate(template, params);
        return (
            <span>{children}</span>
        );
    }
}

const TOKEN = /\${([\w]*)}/g;
/**
 * A very simple templating scheme:
 * template = 'This ${item} costs ${price}'
 * params = {item: 'boots', price: '100'})
 * result: 'This boots costs 100, John'
 */
function applyTemplate(template, params) {
    if (typeof template === 'string' && params) {
        return template.replace(TOKEN, function(wholeMatch, key) {
            return (key in params &&
                    typeof params[key] !== 'object' &&
                    typeof params[key] !== 'function' &&
                    typeof params[key] !== 'undefined')
                ? params[key]
                : wholeMatch;
        });
    } else {
        // We cannot do any processing - just return the original
        return template;
    }
}
