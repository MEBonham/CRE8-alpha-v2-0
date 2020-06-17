import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Resting = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <section>
                <h1>Short Rests</h1>
                <p>A Short Rest requires ten minutes, and must be spent doing activities that allow a character to "cool down" from the excitement of combat (or other high-adrenaline situations). Characters do not have to sit completely still and do nothing during a Short Rest, but they can't engage in strenuous activities. Light conversation, moderate phyical stretching, or meditation are common ways for characters to pass the time while taking a Short Rest.</p>
                <p>Some abilities or tasks require a short rest in order to use or activate them. Some such abilities are intense enough that they don't allow a character to gain the other benefits of a Short Rest, such as picking a lock. (These activities just happen to take about ten minutes.) Activities that don't specify that they require such intensity, however, can be processed or prepared for <em>while</em> taking a short rest&mdash;and the character who wishes to take advantage of them <em>should</em> be doing such preparation throughout the short rest.</p>
            </section>
            <section>
                <h2>Benefits of a Short Rest</h2>
                <p>You can recover all lost VP during a Short Rest by expending 1 Reserve Point.</p>
                <p>If you have at least one Reserve Point available, you can regain all expended MP during a Short Rest. Attempt a TN 20 Willpower Save. If the save fails, you still regain your MP, but you lose a Reserve Point to replenish your mental (or spiritual) reserves.</p>
                <p>A character who has exerted can clear that exertion by taking a Short Rest and expending 1 Reserve Point.</p>
            </section>
            <section>
                <h1>Extended Rests</h1>
                <p>An Extended Rest requires about six hours, although about eight hours is more pleasant to most characters (but has no additional mechanical benefit).</p>
                <p>During the time of an Extended Rest, most creatures must be asleep or similarly inert, or trying to do so, in order to gain the benefits of the rest.</p>
                <p>An Extended Rest does not <em>have</em> to be contiguous time. For example, it is common for adventurers to take a two-hour shift in the middle of their sleeping time to "keep watch" over their allies. They still can gain the benefits of the Long Rest as long as the total resting time before and after their watch was at least six hours.</p>
                <p>The main benefit of an Extended Rest is to regain spent Reserve Points. A good rest restores all spent Reserve Points, unless a disease or similar effect "blocks" some Reserve Points from being regained. A poorer quality rest can also "block" one or more Reserve Points from being regained, at the GM's discretion.</p>
                <p>A Dying creature who is able to take an Extended Rest may attempt a TN 17 Fortitude Save to lose the Dying condition. A creature who is Wounded but not Dying, who takes an Extended Rest, may attempt a TN 17 Fortitude Save to lose the Wounded condition.</p>
            </section>
        </>
    );
}

export default Resting;