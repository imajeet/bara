import React from 'react';
import { Link } from 'react-router-dom';

import BusinessIndexItem from './business_index_item';

class BusinessIndex extends React.Component {

  // before the search/filter:
  // componentDidMount() {
  //   this.props.fetchAllBusinesses();
  // }

  render() {
    const businessesEntries = this.props.businesses.map(business => (
        <BusinessIndexItem key={ business.id } business={ business } />
      )
    );

    return(
      <div>
        <div className='business-index-main'>
          <div className='center index-grid'>
            <div className='index-grid-col1'>
              <ol className="business-index">
                { businessesEntries }
              </ol>
            </div>

            <div className='index-grid-col2'>
              <div className='index-map'>
                Map goes here
              </div>

              <div className='add-business'>
                <h3>Not here? Tell us what we're missing.</h3>
                <p>If the business you're looking for isn't here, add it!</p>
                <div className='add-business-link'>
                  <Link to='/businesses/new'>Add A Business</Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default BusinessIndex;