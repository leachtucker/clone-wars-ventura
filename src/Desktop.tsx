import styled from 'styled-components';

import wallpaper from './assets/wallpaper.jpg';
import LockedView from './views/LockedView';

function Desktop() {
  return (
    <ViewContainer>
      <LockedView />
    </ViewContainer>
  );
}

export default Desktop;

const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${wallpaper});
  background-size: cover;
`;
