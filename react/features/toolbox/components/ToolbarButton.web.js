/* @flow */

import React, { Component } from 'react';

import { translate } from '../../base/i18n';

import {
    setTooltip,
    setTooltipText
} from '../../../../modules/UI/util/Tooltip';

import StatelessToolbarButton from './StatelessToolbarButton';

declare var APP: Object;

/**
 * Represents a button in Toolbar on React.
 *
 * @class ToolbarButton
 * @extends AbstractToolbarButton
 */
class ToolbarButton extends Component {
    button: Object;
    _createRefToButton: Function;

    /**
     * Toolbar button component's property types.
     *
     * @static
     */
    static propTypes = {
        ...StatelessToolbarButton.propTypes,

        /**
         * Object describing button.
         */
        button: React.PropTypes.object.isRequired,

        /**
         * Handler for component mount.
         */
        onMount: React.PropTypes.func,

        /**
         * Handler for component unmount.
         */
        onUnmount: React.PropTypes.func,

        /**
         * Translation helper function.
         */
        t: React.PropTypes.func,

        /**
         * Indicates the position of the tooltip.
         */
        tooltipPosition:
            React.PropTypes.oneOf([ 'bottom', 'left', 'right', 'top' ])
    };

    /**
     * Initializes new ToolbarButton instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Object) {
        super(props);

        // Bind methods to save the context
        this._createRefToButton = this._createRefToButton.bind(this);
    }

    /**
     * Sets shortcut/tooltip
     * after mounting of the component.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void {
        this._setShortcutAndTooltip();

        if (this.props.onMount) {
            this.props.onMount();
        }
    }

    /**
     * Invokes on unmount handler if it was passed to the props.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void {
        if (this.props.onUnmount) {
            this.props.onUnmount();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): ReactElement<*> {
        const { button } = this.props;
        const popups = button.popups || [];

        const props = {
            ...this.props,
            createRefToButton: this._createRefToButton
        };

        return (
            <StatelessToolbarButton { ...props }>
                { this._renderPopups(popups) }
            </StatelessToolbarButton>
        );
    }

    /**
     * Creates reference to current toolbar button.
     *
     * @param {HTMLElement} element - HTMLElement representing the toolbar
     * button.
     * @returns {void}
     * @private
     */
    _createRefToButton(element: HTMLElement): void {
        this.button = element;
    }

    /**
     * If toolbar button should contain children elements
     * renders them.
     *
     * @returns {ReactElement|null}
     * @private
     */
    _renderInnerElementsIfRequired(): ReactElement<*> | null {
        if (this.props.button.html) {
            return this.props.button.html;
        }

        return null;
    }

    /**
     * Renders popup element for toolbar button.
     *
     * @param {Array} popups - Array of popup objects.
     * @returns {Array}
     * @private
     */
    _renderPopups(popups: Array<*> = []): Array<*> {
        return popups.map(popup => {
            let gravity = 'n';

            if (popup.dataAttrPosition) {
                gravity = popup.dataAttrPosition;
            }

            const title = this.props.t(popup.dataAttr, popup.dataInterpolate);

            return (
                <div
                    className = { popup.className }
                    data-popup = { gravity }
                    id = { popup.id }
                    key = { popup.id }
                    title = { title } />
            );
        });
    }

    /**
     * Sets shortcut and tooltip for current toolbar button.
     *
     * @private
     * @returns {void}
     */
    _setShortcutAndTooltip(): void {
        const { button, tooltipPosition } = this.props;

        if (!button.unclickable) {
            if (button.tooltipText) {
                setTooltipText(this.button,
                    button.tooltipText,
                    tooltipPosition);
            } else {
                setTooltip(this.button,
                    button.tooltipKey,
                    tooltipPosition);
            }
        }

        if (button.shortcut && APP && APP.keyboardshortcut) {
            APP.keyboardshortcut.registerShortcut(
                button.shortcut,
                button.shortcutAttr,
                button.shortcutFunc,
                button.shortcutDescription
            );
        }
    }
}

export default translate(ToolbarButton);
