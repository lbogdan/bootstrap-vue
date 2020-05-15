import { EVENT_NAME_CLICK, EVENT_NAME_KEYDOWN, EVENT_NAME_MOUSEDOWN } from '../../constants/events'
import { SLOT_NAME_BUTTON_CONTENT, SLOT_NAME_DEFAULT } from '../../constants/slot-names'
import Vue from '../../utils/vue'
import { htmlOrText } from '../../utils/html'
import { pluckProps } from '../../utils/props'
import dropdownMixin from '../../mixins/dropdown'
import idMixin from '../../mixins/id'
import normalizeSlotMixin from '../../mixins/normalize-slot'
import { props as BDropdownProps } from '../dropdown/dropdown'
import { BLink } from '../link/link'

// --- Props ---

export const props = pluckProps(
  ['text', 'html', 'menuClass', 'toggleClass', 'noCaret', 'role', 'lazy'],
  BDropdownProps
)

// --- Main component ---
// @vue/component
export const BNavItemDropdown = /*#__PURE__*/ Vue.extend({
  name: 'BNavItemDropdown',
  mixins: [idMixin, dropdownMixin, normalizeSlotMixin],
  props,
  computed: {
    toggleId() {
      return this.safeId('_BV_toggle_')
    },
    isNav() {
      // Signal to dropdown mixin that we are in a navbar
      return true
    },
    dropdownClasses() {
      return [this.directionClass, { show: this.visible }]
    },
    menuClasses() {
      return [
        this.menuClass,
        {
          'dropdown-menu-right': this.right,
          show: this.visible
        }
      ]
    },
    toggleClasses() {
      return [this.toggleClass, { 'dropdown-toggle-no-caret': this.noCaret }]
    }
  },
  render(h) {
    const { toggleId, visible } = this

    const $toggle = h(
      BLink,
      {
        staticClass: 'nav-link dropdown-toggle',
        class: this.toggleClasses,
        props: {
          href: `#${this.id || ''}`,
          disabled: this.disabled
        },
        attrs: {
          id: toggleId,
          role: 'button',
          'aria-haspopup': 'true',
          'aria-expanded': visible ? 'true' : 'false'
        },
        on: {
          [EVENT_NAME_MOUSEDOWN]: this.onMousedown,
          [EVENT_NAME_CLICK]: this.toggle,
          [EVENT_NAME_KEYDOWN]: this.toggle // Handle ENTER, SPACE and DOWN
        },
        ref: 'toggle'
      },
      [
        // TODO: The `text` slot is deprecated in favor of the `button-content` slot
        this.normalizeSlot([SLOT_NAME_BUTTON_CONTENT, 'text']) ||
          h('span', { domProps: htmlOrText(this.html, this.text) })
      ]
    )

    const $menu = h(
      'ul',
      {
        staticClass: 'dropdown-menu',
        class: this.menuClasses,
        attrs: {
          tabindex: '-1',
          'aria-labelledby': toggleId
        },
        on: {
          [EVENT_NAME_KEYDOWN]: this.onKeydown // Handle UP, DOWN and ESC
        },
        ref: 'menu'
      },
      !this.lazy || visible ? this.normalizeSlot(SLOT_NAME_DEFAULT, { hide: this.hide }) : [h()]
    )

    return h(
      'li',
      {
        staticClass: 'nav-item b-nav-dropdown dropdown',
        class: this.dropdownClasses,
        attrs: { id: this.safeId() }
      },
      [$toggle, $menu]
    )
  }
})
