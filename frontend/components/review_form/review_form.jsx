import React from 'react';
import {
  Link
} from 'react-router-dom';
import update from 'immutability-helper';

import {
  createReview,
  fetchReview,
  editReview,
  deleteReview,
} from '../../util/review_api_util';
import {
  fetchBusiness,
} from '../../util/business_api_util';

import ErrorList from '../error_list';
import ReviewFormCore from './review_form_core';

export default class ReviewForm extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      business: {},
      review: {},
      errors: [],
      loaded: false,
    };

    this.fetchInfo = this.fetchInfo.bind( this );
    this.fetchBusiness = this.fetchBusiness.bind( this );
    this.fetchReviewToEdit = this.fetchReviewToEdit.bind( this );
    this.clearErrors = this.clearErrors.bind( this );

    this.handleReviewRatingChange = this.handleReviewRatingChange.bind( this );
    this.handleReviewBodyChange = this.handleReviewBodyChange.bind( this );
    this.handleDelete = this.handleDelete.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  componentDidMount() {
    if ( this.props.formType === 'createReview' ) {
      const businessId = this.props.match.params.business_id;
      if ( this.props.currentUser.reviewed_businesses[ businessId ] ) {
        const reviewId = this.props.currentUser.reviewed_businesses[ businessId ];
        this.props.history.push( `/reviews/${reviewId}/edit` );
      }
    } else {
      this.fetchInfo( this.props );
    }
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.formType !== this.props.formType ) {
      this.fetchInfo( nextProps );
    } else if (
      this.props.formType === 'createReview' &&
      this.props.match.params.business_id !== nextProps.match.params.business_id
    ) {
      this.fetchInfo( nextProps );
    } else if (
      this.props.formType === 'editReview' &&
      this.props.match.params.id !== nextProps.match.params.id
    ) {
      this.fetchInfo( nextProps );
    }
  }

  fetchInfo( props ) {
    window.scrollTo( 0, 0 );
    this.setState( {
      business: {},
      review: {},
      errors: [],
      loaded: false
    } );
    if ( props.formType === 'createReview' ) {
      this.fetchBusiness( props.match.params.business_id );
    } else {
      this.fetchReviewToEdit( props.match.params.id );
    }
  }

  fetchBusiness( businessId ) {
    fetchBusiness( businessId )
      .then(
        business => {
          this.setState( {
            business,
            review: {},
            errors: [],
            loaded: true,
          } );
        },
        errors => this.setState( {
          business: {},
          review: {},
          errors: errors.responseJSON,
          loaded: true,
        } )
      );
  }

  fetchReviewToEdit( reviewId ) {
    fetchReview( reviewId )
      .then(
        review => {
          if ( this.props.currentUser.id === review.author_id ) {
            fetchBusiness( review.business_id )
              .then(
                business => {
                  this.setState( {
                    business,
                    review,
                    errors: [],
                    loaded: true,
                  } );
                }
              );
          } else {
            this.setState( {
              errors: [ 'Only the author can edit the review' ],
            } );
          }
        },
        errors => this.setState( {
          business: {},
          review: {},
          errors: errors.responseJSON,
          loaded: true,
        } )
      );
  }

  clearErrors() {
    this.setState( {
      errors: []
    } );
  }

  handleReviewRatingChange( rate ) {
    let {
      review
    } = this.state;
    const updatedReview = update( review, {
      rating: {
        $set: rate
      }
    } );
    this.setState( {
      review: updatedReview,
    } );
  }

  handleReviewBodyChange( e ) {
    e.preventDefault();
    let {
      review
    } = this.state;
    const updatedReview = update( review, {
      body: {
        $set: e.currentTarget.value
      }
    } );
    this.setState( {
      review: updatedReview,
    } );
  }


  handleDelete( e ) {
    e.preventDefault();
    deleteReview( this.props.match.params.id )
      .then( () => {
        this.props.history
          .push( `/businesses/${this.state.review.business_id}` );
      } );
  }

  handleSubmit( e ) {
    e.preventDefault();
    window.scrollTo( 0, 0 );
    const reviewData = Object.assign( {}, this.state.review );
    reviewData.business_id = this.state.business.id;
    if ( this.props.formType === 'createReview' ) {
      createReview( reviewData )
        .then(
          review =>
          this.props.history.push( `/businesses/${review.business_id}` ),
          errors => this.setState( {
            errors: errors.responseJSON,
          } )
        );
    } else {
      editReview( reviewData )
        .then(
          review =>
          this.props.history.push( `/businesses/${review.business_id}` ),
          errors => this.setState( {
            errors: errors.responseJSON,
          } )
        );
    }
  }

  render() {
    const {
      business,
      review,
      errors,
      loaded,
    } = this.state;
    const {
      formType
    } = this.props;
    if ( !loaded ) {
      return (
        <img className='spinner' src={window.staticImages.spinner} />
      );
    }
    if ( !business.id || ( formType === 'editReview' && !review.id ) ) {
      return (
        <div className='center'>
          <ErrorList errors={errors}
            clearErrors={this.clearErrors} />
          <Link to="/" className='link-as-button'>
            Go Home
          </Link>
        </div>
      );
    }
    return (
      <div className='center review-form'>
        <ErrorList errors={ this.state.errors }
          clearErrors={this.clearErrors} />
        <ReviewFormCore
          formType={formType}
          business={business}
          review={review}
          handleReviewRatingChange={this.handleReviewRatingChange}
          handleReviewBodyChange={this.handleReviewBodyChange}
          handleDelete={this.handleDelete}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
