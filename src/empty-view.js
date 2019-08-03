import React from "react";
import PropTypes from "prop-types";

function EmptyView(props) {
  return (
    <div className="text-center">
      <span className="app__empty-view__emoji" role="img" aria-label="emoji">
        {props.emoji}
      </span>
      <h3 className="app__empty-view__title text-center">{props.title}</h3>
      {props.subtitle && props.url && (
        <a className="app__stories__story__link" href={props.url}>
          {props.subtitle}
        </a>
      )}
    </div>
  );
}

EmptyView.propTypes = {
  emoji: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  url: PropTypes.string
};

EmptyView.defaultProps = {
  emoji: "😔"
};

export default EmptyView;
