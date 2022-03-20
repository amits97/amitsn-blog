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
        let language = (this.props.className && this.props.className.split("-")[1]) || "js";
        console.log(this.props);

        return (
            <Lowlight
                language={language || 'js'}
                value={this.props.node.children[0].value || ''}
                inline={this.props.inline}
            />
        );
    }
});

export default CodeBlock;
