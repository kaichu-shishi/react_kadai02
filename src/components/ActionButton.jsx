export const ActionButton = ({ text, action }) => {
    return (
      <>
        <button type="button" onClick={action}>
            {text}
        </button>
      </>
    );
};

// 実は上記の{ text, action }も分割代入！
// 分割代入を使わないなら、(props)、{props.action}、{props.text}となる。