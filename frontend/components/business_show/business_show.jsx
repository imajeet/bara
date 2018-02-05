import React from 'react';
import PropTypes from 'prop-types';
import {
  fetchBusiness,
} from '../../util/business_api_util';

import ErrorList from '../error_list';
import BusinessShowCore from './business_show_core';

export default class BusinessShow extends React.Component {
  state = {
    business: null,
    errors: [],
    reviewId: null,
    loading: true,
  };

  componentDidMount = () => {
    this.fetchAndSaveBusiness(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.businessChanged(nextProps)) {
      this.resetState();
      this.fetchAndSaveBusiness(nextProps);
    }
  };

  fetchAndSaveBusiness = (props) => {
    fetchBusiness(props.match.params.id)
      .then(
        this.saveBusiness(props),
        this.recordErrors,
      );
    window.scrollTo(0, 0);
  };

  saveBusiness = props => (business) => {
    const reviewId = this.getReviewId(props, business);
    this.setState({
      business,
      reviewId,
      errors: [],
      loading: false,
    });
  };

  getReviewId = (props, business) => {
    if (this.currentUserHasReviewedBusiness(props, business)) {
      return business.reviewers[props.currentUser.id];
    }
    return null;
  };

  currentUserHasReviewedBusiness = (props, business) => (
    props.currentUser && business.reviewers[props.currentUser.id]
  );

  businessChanged = nextProps => (
    nextProps.match.params.id !== this.props.match.params.id
  );

  resetState = () => {
    this.setState({
      business: null,
      errors: [],
      reviewId: null,
      loading: true,
    });
  };

  clearErrors = () => {
    this.setState({
      errors: [],
    });
  };

  recordErrors = (errors) => {
    this.setState({
      business: null,
      reviewId: null,
      errors: errors.responseJSON,
      loading: false,
    });
  };

  render = () => {
    const {
      business,
      errors,
      loading,
      reviewId,
    } = this.state;
    if (loading) {
      return (
        <img alt="" className="spinner" src={window.staticImages.spinner} />
      );
    }
    if (errors.length > 0) {
      return (
        <div className="center">
          <ErrorList
            errors={errors}
            clearErrors={this.clearErrors}
          />
          <a href="#/" className="link-as-button">
            Go Home
          </a>
        </div>
      );
    }
    return (
      <BusinessShowCore
        business={business}
        reviewId={reviewId}
      />
    );
  };
}

BusinessShow.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

BusinessShow.defaultProps = {
  match: {
    params: {
      id: -1,
    },
  },
};
