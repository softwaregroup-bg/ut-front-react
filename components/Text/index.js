import React from 'react';

Text.propTypes = {
    children: React.PropTypes.string,
    params: React.PropTypes.object,
    prefix: React.PropTypes.string // prefix, narrowing search in translation dictionary
};

Text.contextTypes = {
    language: React.PropTypes.string,
    translate: React.PropTypes.func
};

export default function Text(props, context) {
    let {children, params, prefix} = props;
    let template = children;
    if (typeof context.translate === 'function') {
        var text = (prefix ? [prefix, children] : [children]).join('>');
        // Translate the template
        template = context.translate(text, context.language);
        if (template === text) {
            template = children;
        }
    }
    // In either case - apply the params to the template
    children = applyTemplate(template, params);
    return (
        <span>{children}</span>
    );
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
