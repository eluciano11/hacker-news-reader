import React, { PureComponent } from "react";

/**
 * Higher ordered component that will verify the network state of the
 * system. When the network state changes the WrappedComponent will re-render and
 * will receive an isOnline flag.
 *
 * @param {Object} WrappedComponent - Component to decorate.
 */
function withNetworkStatus(WrappedComponent) {
  return class extends PureComponent {
    state = {
      isOnline: navigator.onLine
    };

    componentDidMount() {
      window.addEventListener("online", this.toggleNetworkState);
      window.addEventListener("offline", this.toggleNetworkState);
    }

    componentWillUnmount() {
      window.removeEventListener("online", this.toggleNetworkState);
      window.removeEventListener("offline", this.toggleNetworkState);
    }

    toggleNetworkState = () => {
      this.setState({ isOnline: navigator.onLine });
    };

    render() {
      return <WrappedComponent isOnline={this.state.isOnline} />;
    }
  };
}

export default withNetworkStatus;
