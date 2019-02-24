import React from 'react';
import PropTypes from 'prop-types';
import Lowlight from 'react-lowlight';
import shallowCompare from 'react-addons-shallow-compare';
import js from 'highlight.js/lib/languages/javascript';
import nginx from 'highlight.js/lib/languages/nginx';

Lowlight.registerLanguage('js', js);
Lowlight.registerLanguage('nginx', nginx);

var createReactClass = require('create-react-class');
const CodeBlock = createReactClass({
    displayName: 'CodeBlock',
    propTypes: {
        value: PropTypes.string,
        language: PropTypes.string,
        inline: PropTypes.bool
    },

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    },

    render: function() {
        return (
            <Lowlight
                language={this.props.language || 'js'}
                value={this.props.value}
                inline={this.props.inline}
            />
        );
    }
});

export default CodeBlock;
