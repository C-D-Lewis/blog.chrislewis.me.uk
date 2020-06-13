/** Colors used in components. */
const Colors = {
  lightGrey: '#0004',
  veryLightGrey: '#0002',
};

/**
 * RootContainer component.
 *
 * @returns {HTMLElement}
 */
const RootContainer = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
});

/**
 * LeftColumn component.
 *
 * @returns {HTMLElement}
 */
const LeftColumn = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#333',
  flex: '0 0 180px',
  justifyContent: 'start',
  padding: '20px 10px',
});

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () => DOM.create('div', {
  flex: '1 1 600px',
  height: '100%',
  borderLeft: `1px solid ${Colors.lightGrey}`,
  paddingLeft: '30px',
});

/**
 * PostTitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostTitle = () => DOM.create('h1', {
  display: 'block',
  color: '#ddd',
  fontFamily: 'sans-serif',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginTop: '30px',
  border: 'none',
  minWidth: '500px',
  outline: 'none',
});

/**
 * PostDate component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostDate = () => DOM.create('div', {
  minWidth: '180px',
  display: 'block',
  color: '#aaa',
  fontFamily: 'sans-serif',
  fontSize: '1.2rem',
  marginTop: '10px',
  border: 'none',
  outline: 'none',
});

/**
 * PostBody component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostBody = () => DOM.create('textarea', {
  display: 'block',
  width: '90%',
  minHeight: '700px',
  color: 'black',
  fontFamily: 'sans-serif',
  fontSize: '1rem',
  marginTop: '20px',
  padding: '5px',
  border: 'none',
  outline: 'none',
}, {
  disabled: 'true',
});

/**
 * SimpleRow component.
 *
 * @returns {HTMLElement}
 */
const SimpleRow = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
});

window.UIComponents = {
  RootContainer,
  LeftColumn,
  CentralColumn,
  PostTitle,
  PostDate,
  PostBody,
  SimpleRow,
};
